import { IAgenticaEventJson } from "@agentica/core";
import { IAgenticaRpcListener, IAgenticaRpcService } from "@agentica/rpc";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState
} from "react";
import { Driver, WebSocketConnector } from "tgrid";

interface AgenticaRpcContextType {
  messages: IAgenticaEventJson[];
  conversate: (message: string) => Promise<void>;
  isConnected: boolean;
  isError: boolean;
  tryConnect: () => Promise<
    | WebSocketConnector<
      null,
      IAgenticaRpcListener,
      IAgenticaRpcService<"chatgpt">
    >
    | undefined
  >;
}

const AgenticaRpcContext = createContext<AgenticaRpcContextType | null>(null);

export function AgenticaRpcProvider({ children }: PropsWithChildren) {
  const [messages, setMessages] = useState<IAgenticaEventJson[]>([]);
  const [isError, setIsError] = useState(false);
  const [driver, setDriver] =
    useState<Driver<IAgenticaRpcService<"chatgpt">, false>>();

  const pushMessage = useCallback(
    async (message: IAgenticaEventJson) =>
      setMessages((prev) => [...prev, message]),
    []
  );

  const tryConnect = useCallback(async () => {
    try {
      setIsError(false);
      const connector: WebSocketConnector<
        null,
        IAgenticaRpcListener,
        IAgenticaRpcService<"chatgpt">
      > = new WebSocketConnector<
        null,
        IAgenticaRpcListener,
        IAgenticaRpcService<"chatgpt">
      >(null, {
        assistantMessage: pushMessage,
        describe: pushMessage,
        userMessage: pushMessage
      });
      await connector.connect(import.meta.env.VITE_AGENTICA_WS_URL);
      const driver = connector.getDriver();
      setDriver(driver);
      return connector;
    } catch (e) {
      console.error(e);
      setIsError(true);
    }
  }, [pushMessage]);

  const conversate = useCallback(
    async (message: string) => {
      if (!driver) {
        console.error("Driver is not connected. Please connect to the server.");
        return;
      }
      try {
        await driver.conversate(message);
      } catch (e) {
        console.error(e);
        setIsError(true);
      }
    },
    [driver]
  );

  useEffect(() => {
    (async () => {
      const connector = await tryConnect();
      return () => {
        connector?.close();
        setDriver(undefined);
      };
    })();
  }, [tryConnect]);

  const isConnected = !!driver;

  return (
    <AgenticaRpcContext.Provider
      value={{ messages, conversate, isConnected, isError, tryConnect }}
    >
      {children}
    </AgenticaRpcContext.Provider>
  );
}

export function useAgenticaRpc() {
  const context = useContext(AgenticaRpcContext);
  if (!context) {
    throw new Error("useAgenticaRpc must be used within AgenticaRpcProvider");
  }
  return context;
}
