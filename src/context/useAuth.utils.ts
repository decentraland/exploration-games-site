import { ChainId, getChainName } from "@dcl/schemas/dist/dapps/chain-id"
import { ProviderType } from "@dcl/schemas/dist/dapps/provider-type"
import * as SSO from "@dcl/single-sign-on-client"
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { Provider, connection } from "decentraland-connect"
import { setCurrentIdentity } from "./auth/storage"
import { AuthState, AuthStatus } from "./useAuth.types"

const initialState: AuthState = Object.freeze({
  selecting: false,
  account: null,
  identity: null,
  provider: null,
  providerType: null,
  chainId: null,
  error: null,
  status: AuthStatus.Restoring,
})

const fetchAccounts = async (provider: Provider) => {
  const currentAccounts = (await provider.request({
    method: "eth_accounts",
  })) as string[]
  if (currentAccounts.length === 0) {
    throw new Error(`Provider is not connected`)
  }

  return currentAccounts.map((account) => account.toLowerCase())
}

const fetchChainId = async (provider: Provider) => {
  const currentChainId = (await provider.request({
    method: "eth_chainId",
  })) as string
  return parseInt(currentChainId, 16)
}

const restoreConnection = async (): Promise<AuthState> => {
  try {
    const connectionData = connection.getConnectionData()

    if (connectionData) {
      const { providerType, chainId } = connectionData
      const data = await connection.connect(providerType, chainId)
      const provider = data.provider

      if (!provider) {
        throw new Error(`Error getting provider`)
      }

      const currentAccounts = await fetchAccounts(provider)
      const account = currentAccounts[0]
      // Get the identity first from the local storage. If it doesn't exist, get it from the iframe.
      const identity =
        SSO.localStorageGetIdentity(account) ?? (await SSO.getIdentity(account))

      if (identity) {
        const currentChainId = await fetchChainId(provider)
        await setCurrentIdentity(identity)

        return {
          account,
          provider,
          chainId: Number(currentChainId),
          providerType,
          identity,
          status: AuthStatus.Connected,
          selecting: false,
          error: null,
        }
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error(err)
    // ErrorClient.report("Error restoring connection", err)

    return {
      ...initialState,
      status: AuthStatus.Disconnected,
      error: err.message,
    }
  }

  return { ...initialState, status: AuthStatus.Disconnected }
}

const createConnection = async (
  providerType: ProviderType,
  chainId: ChainId
) => {
  try {
    const data = await connection.connect(providerType, chainId)
    const provider = data.provider

    if (!provider) {
      throw new Error(`Error getting provider`)
    }

    const currentAccounts = await fetchAccounts(provider)
    const account = currentAccounts[0]
    const identity = await SSO.getIdentity(account)

    if (identity) {
      const currentChainId = await fetchChainId(provider)
      await setCurrentIdentity(identity)

      return {
        account,
        provider,
        chainId: Number(currentChainId),
        providerType,
        identity,
        status: AuthStatus.Connected,
        selecting: false,
        error: null,
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error(err)

    await setCurrentIdentity(null)
    return {
      ...initialState,
      status: AuthStatus.Disconnected,
      error: err.message,
    }
  }

  return { ...initialState, status: AuthStatus.Disconnected }
}

const switchToChainId = async (provider: Provider | null, chainId: ChainId) => {
  if (provider) {
    try {
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x" + chainId.toString(16) }],
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await provider.request({
            method: "wallet_addEthereumChain",
            params: [getAddEthereumChainParameters(chainId)],
          })

          const currentChainId = await fetchChainId(provider)
          if (currentChainId !== chainId) {
            throw new Error("chainId did not change after adding network")
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (addError: any) {
          throw new Error(`Error adding network: ${addError.message}`)
        }
      } else {
        throw new Error(`Error switching network: ${switchError.message}`)
      }
    }
  }
}

const isLoading = (status: AuthStatus) => {
  switch (status) {
    case AuthStatus.Connected:
    case AuthStatus.Disconnected:
      return false

    default:
      return true
  }
}

const getAddEthereumChainParameters = (chainId: ChainId) => {
  const hexChainId = "0x" + chainId.toString(16)
  const chainName = getChainName(chainId)!
  return {
    chainId: hexChainId,
    chainName,
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: ["https://rpc-mainnet.maticvigil.com/"],
    blockExplorerUrls: ["https://polygonscan.com/"],
  }
}

export {
  initialState,
  fetchAccounts,
  fetchChainId,
  restoreConnection,
  createConnection,
  isLoading,
  switchToChainId,
  getAddEthereumChainParameters,
}
