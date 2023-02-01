import { isUUID } from "@/utilts/isUUID"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  Checkbox,
  Icons,
  Label,
} from "ui"

import PageInfo from "@/components/PageInfo"
import { useApi } from "./Provider"

const ApiFiles = () => {
  const {
    data,
    onSelectFiles,
    selectedFiles,
    onToggleSelectedFiles,
    onDeleteFiles,
    deleting,
  } = useApi()

  if (!data) return <PageInfo>Loading...</PageInfo>

  return (
    <div className="flex flex-col divide-y overflow-hidden rounded-md border bg-white">
      <div className="flex items-center justify-between bg-gray-50 py-2 pl-4 pr-2">
        <div className="flex items-center space-x-4">
          <Checkbox
            checked={selectedFiles.length > 0}
            disabled={data.files?.length === 0}
            id="files"
            onClick={onToggleSelectedFiles}
          />
          <Label htmlFor="files" className="text-sm font-medium">
            Files
          </Label>
        </div>
        {selectedFiles.length ? (
          <AlertDialog>
            <AlertDialogTrigger asChild disabled={deleting}>
              <Button size="sm" variant="ghost">
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {`Are you sure you want to delete ${selectedFiles.length} ${
                    selectedFiles.length === 1 ? "file" : "files"
                  }?`}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Files are permanently deleted.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={onDeleteFiles}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <div className="h-8" />
        )}
      </div>
      {(data.files ?? []).length > 0 ? (
        <ul className="divide-y">
          {data.files?.map((item) => (
            <li key={item.id} className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <Checkbox
                  checked={selectedFiles.includes(item.id)}
                  onClick={() => onSelectFiles(item.id)}
                />
                <Icons.proto className="ml-4 mr-2 h-4 w-4" />
                <span className="text-sm">
                  {isUUID(item.url.split("/")[1].slice(0, 36))
                    ? item.url.split("/")[1].slice(37)
                    : item.url.split("/")[1]}
                </span>
              </div>
              <span className="text-sm text-gray-500">
                {new Intl.DateTimeFormat("pt-BR", {
                  dateStyle: "short",
                  timeStyle: "short",
                  timeZone: "America/Sao_Paulo",
                }).format(new Date(item.created_at))}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex h-[96px] items-center justify-center">
          <span className="text-sm text-gray-500">
            {`You still don't have any files added in your API, click in "Add files" button to upload.`}
          </span>
        </div>
      )}
    </div>
  )
}

export default ApiFiles
