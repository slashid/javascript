import { useSlashID } from "../../main";

interface Props {
    fallback?: JSX.Element
    children: JSX.Element
}

/**
 * Conditional rendering helper
 * 
 * Acts as a guard for SlashID core SDK dependent operations. Can optionally render a fallback component while the SDK is loading.
 */
export const SlashIDLoaded  = ({ fallback, children }: Props): JSX.Element => {
    const { sdkState } = useSlashID()

    if (sdkState !== "ready") {
        if (!fallback) return <></>

        return fallback
    }

    return (
        <>
            {children}
        </>
    )
}