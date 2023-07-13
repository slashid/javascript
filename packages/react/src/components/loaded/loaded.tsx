import { SDKState } from "../../context/slash-id-context";
import { useSlashID } from "../../main";

interface Props {
    fallback?: React.ReactNode
    children: React.ReactNode
}

/**
 * Conditional rendering helper
 * 
 * Acts as a guard for SlashID core SDK dependent operations
 */
export const SlashIDLoaded: React.FC<Props>  = ({ fallback, children }) => {
    const { sdkState } = useSlashID()

    if (sdkState !== SDKState.Ready) {
        if (!fallback) return null

        return (
            <>
                {fallback}
            </>
        )
    }

    return (
        <>
            {children}
        </>
    )
}