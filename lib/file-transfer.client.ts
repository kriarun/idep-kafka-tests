import SftpClient from 'ssh2-sftp-client';
import * as path from 'path';
import { config } from '../config';

export async function copyFileToRemote(shareId: string): Promise<void> {
  const sftp = new SftpClient();

  const localFilePath = path.resolve(
    `./test-data/documents/${shareId}.pdf`
  );
  const remoteFilePath = `${config.fileTransfer.remoteFolderPath}/${shareId}.pdf`;

  try {
    await sftp.connect({
      host: config.fileTransfer.host,
      port: config.fileTransfer.port,
      username: config.fileTransfer.username,
      password: config.fileTransfer.password
    });

    console.log(`Copying ${shareId}.pdf to remote folder...`);
    await sftp.put(localFilePath, remoteFilePath);
    console.log(`${shareId}.pdf copied successfully`);

  } finally {
   try {
    await sftp.end();
  } catch {
    // ignore close errors — file transfer already completed
  }
  }
}