import { useCallback, useEffect, useMemo, useState } from "react"
import { ProviderType } from "@dcl/schemas/dist/dapps/provider-type"
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { connection } from "decentraland-connect"
import { clearIdentity, setCurrentIdentity } from "./auth/storage"
import {
  createConnection,
  initialState,
  isLoading,
  restoreConnection,
  switchToChainId,
} from "./useAuth.utils"
import { logger } from "../utils/logger"
import { AuthState, AuthStatus } from "./useAuth.types"
import type { ChainId } from "@dcl/schemas/dist/dapps/chain-id"

let CONNECTION_PROMISE: Promise<AuthState> | null = null

const useAuth = (
  {
    authPath,
  }: {
    authPath: string
  } = { authPath: "/auth" }
) => {
  const [state, setState] = useState<AuthState>({ ...initialState })

  const authorize = useCallback(() => {
    window.location.replace(
      `${authPath}/login?redirectTo=${window.location.href}`
    )
    return
  }, [])

  const select = useCallback(() => {
    if (isLoading(state.status)) {
      return
    }

    setState((current) => ({ ...current }))
  }, [state])

  const connect = useCallback(
    (providerType: ProviderType, chainId: ChainId) => {
      if (isLoading(state.status)) {
        return
      }
      if (state.account) {
        console.warn(`Already connected as "${state.account}"`)
        return
      }
      const conn = { providerType, chainId }
      if (!providerType || !chainId) {
        const message = `Invalid connection params: ${JSON.stringify(conn)}`
        console.error(message)
        return
      }
      setState({
        account: null,
        identity: null,
        provider: null,
        error: null,
        selecting: state.selecting,
        status: AuthStatus.Connecting,
        providerType,
        chainId,
      })
    },
    [state]
  )

  const disconnect = useCallback(
    (signOut?: boolean) => {
      if (isLoading(state.status)) {
        return
      }

      if (!state.account) {
        return
      }

      if (signOut) {
        clearIdentity()
      }

      setState({
        status: AuthStatus.Disconnecting,
        account: null,
        identity: null,
        provider: null,
        error: null,
        selecting: false,
        providerType: null,
        chainId: null,
      })
    },
    [state]
  )

  const disconnectAndSignOut = useCallback(() => disconnect(true), [disconnect])

  const [switching, setIsSwitchingChain] = useState(false)

  const switchTo = useCallback(
    async (chainId: ChainId) => {
      if (
        state.providerType === ProviderType.INJECTED ||
        state.providerType === ProviderType.MAGIC ||
        state.providerType === ProviderType.WALLET_CONNECT_V2 ||
        state.providerType === ProviderType.WALLET_CONNECT
      ) {
        try {
          setIsSwitchingChain(true)
          await switchToChainId(state.provider, chainId)
          setState({ ...state, chainId: Number(chainId) })
          setIsSwitchingChain(false)

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          setState({ ...state, error: err.message })
          setIsSwitchingChain(false)
        }
      }
    },
    [state]
  )

  // connect or disconnect
  useEffect(() => {
    let cancelled = false

    if (state.status === AuthStatus.Restoring) {
      if (!CONNECTION_PROMISE) {
        CONNECTION_PROMISE = restoreConnection()
      }

      Promise.resolve(CONNECTION_PROMISE)
        .then((result) => {
          if (!cancelled) {
            setState(result)
          }

          CONNECTION_PROMISE = null
        })
        .catch((err) => {
          logger.error("Error restoring session", err)
          CONNECTION_PROMISE = null
        })
    }

    // connect
    if (
      state.status === AuthStatus.Connecting &&
      state.providerType &&
      state.chainId
    ) {
      if (!CONNECTION_PROMISE) {
        CONNECTION_PROMISE = createConnection(state.providerType, state.chainId)
      }

      Promise.resolve(CONNECTION_PROMISE)
        .then((result) => {
          if (!cancelled) {
            if (result.status !== AuthStatus.Connected) {
              result.selecting = state.selecting
            }

            setState(result)
          }

          CONNECTION_PROMISE = null
        })
        .catch((err) => {
          CONNECTION_PROMISE = null
          logger.error("Error creating session", err)
        })
    }

    // disconnect
    if (
      state.status === AuthStatus.Disconnecting &&
      state.providerType === null &&
      state.chainId === null
    ) {
      connection
        .disconnect()
        .then(() => setCurrentIdentity(null))
        .catch((err) => {
          console.error(err)
        })
      setState({
        ...initialState,
        status: AuthStatus.Disconnected,
      })
    }

    return () => {
      cancelled = true
    }
  }, [state])

  useEffect(() => {
    const provider = state.provider
    const onDisconnect = () => disconnect()
    const onChainChanged = (chainId: ChainId) =>
      setState({ ...state, chainId: Number(chainId) })

    if (provider && !provider.isFortmatic) {
      if (provider.on) {
        provider.on("chainChanged", onChainChanged)
        provider.on("accountsChanged", onDisconnect)
        provider.on("disconnect", onDisconnect)
      } else if (provider.addListener) {
        provider.addListener("chainChanged", onChainChanged)
        provider.addListener("accountsChanged", onDisconnect)
        provider.addListener("disconnect", onDisconnect)
      }
    }

    return () => {
      if (provider && !provider.isFortmatic) {
        if (provider.off) {
          provider.off("chainChanged", onChainChanged)
          provider.off("accountsChanged", onDisconnect)
          provider.off("disconnect", onDisconnect)
        } else if (provider.removeListener) {
          provider.removeListener("chainChanged", onChainChanged)
          provider.removeListener("accountsChanged", onDisconnect)
          provider.removeListener("disconnect", onDisconnect)
        }
      }
    }
  }, [state])

  const loading = isLoading(state.status) || switching

  const actions = useMemo(
    () => ({
      connect,
      disconnect: disconnectAndSignOut,
      switchTo,
      select,
      authorize,
      loading,
      error: state.error,
      selecting: state.selecting,
      provider: !loading ? state.provider : null,
      providerType: !loading ? state.providerType : null,
      chainId: !loading ? state.chainId : null,
    }),
    [connect, switchTo, select, authorize, disconnectAndSignOut, loading, state]
  )

  return [state.account, actions] as const
}
export { initialState, useAuth }
