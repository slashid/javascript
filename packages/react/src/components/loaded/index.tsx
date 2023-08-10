import { useSlashID } from "../..";

interface Props {
    fallback?: React.ReactElement
    children: React.ReactElement
}

/**
 * Conditional rendering helper
 * 
 * Acts as a guard for SlashID core SDK dependent operations. Can optionally render a fallback component while the SDK is loading.
 */
export const SlashIDLoaded  = ({ fallback, children }: Props) => {
    const { isLoading } = useSlashID()

    if (isLoading) {
        if (!fallback) return null

        return fallback
    }

    return children
}