import SftpClient from 'ssh2-sftp-client';
import * as path from 'path';
import { config } from '../config';

export async function copyFileToRemote(shareId: string): Promise<void> {
  const sftp = new SftpClient();

  // ECONNRESET — server closes connection abruptly after transfer completion
  // harmless — file already transferred successfully at this point
  sftp.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'ECONNRESET') return;
    console.error('File transfer error:', err.message);
  });

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

    console.info(`Copying ${shareId}.pdf to remote folder...`);
    await sftp.put(localFilePath, remoteFilePath);
    console.info(`${shareId}.pdf copied successfully`);

  } finally {
    try {
      await sftp.end();
    } catch {
      // suppress close errors — transfer already completed
    }
  }
}