import { sprinkles, Button, Download } from "@slashid/react-primitives";
import { useConfiguration } from "../../../hooks/use-configuration";

export function DownloadCodes({ codes }: { codes: string[] }) {
  const { text } = useConfiguration();

  const handleDownloadCodes = () => {
    const download = document.createElement("a");
    download.setAttribute(
      "href",
      `data:text/plain;charset=utf8,${encodeURIComponent(codes.join("\n"))}`
    );
    download.setAttribute("download", "recovery-codes.txt");

    document.body.appendChild(download);
    download.click();
    document.body.removeChild(download);
  };

  return (
    <Button
      className={sprinkles({
        marginTop: "6",
      })}
      type="button"
      variant="secondary"
      testId="sid-form-authenticating-download-codes-button"
      onClick={handleDownloadCodes}
      icon={<Download />}
    >
      {text["authenticating.downloadCodes"]}
    </Button>
  );
}
