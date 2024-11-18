import { WriteStream, readFile } from 'fs';

function asyncReadFile(fileName: string) {
  return new Promise<string | Buffer>(resolve => {
    readFile(fileName, (_err, data) => {
      resolve(data);
    });
  });
}

function asyncWriteFile(file: string | Buffer, writeStream: WriteStream) {
  return new Promise<boolean>(resolve => {
    writeStream.write(file, () => {
      resolve(true);
    });
  });
}

export async function addFile(fileName: string, stream: WriteStream): Promise<boolean> {
  const file = await asyncReadFile(fileName);

  return await asyncWriteFile(file, stream);
}
