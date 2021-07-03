import { getArgv } from './argv';
import * as path from 'path';
import * as fs from 'fs';
import { from, Observable, of, zip } from 'rxjs';
import { catchError, filter, map } from 'rxjs/operators';
import { RetrivedContract } from './common';

async function retiveContractPaths(): Promise<string[]> {
  const cwd = process.cwd();
  let { contractPaths, contractsDir } = getArgv();
  let filePaths: string[] = [];

  if (contractsDir) {
    try {
      filePaths = await new Promise((resolve, reject) => {
        const dir = path.resolve(cwd, contractsDir!);
  
        fs.readdir(dir, (err, files) => {
          if (err) {
            return reject(err);
          }
  
          resolve(files
            .filter(fileName => fileName.endsWith('.contract'))
            .map(fileName => path.resolve(dir, fileName))
          );
        });
      });
    } catch (e) {}
  }

  if (contractPaths) {
    filePaths.concat(
      contractPaths.map(contractPath => path.resolve(cwd, contractPath))
    );
  }

  return filePaths;
}

async function readFiles(paths: string[]): Promise<RetrivedContract[]> {
  const rxs = paths.map((filePath): Observable<(RetrivedContract | undefined)> => {
    const promise = new Promise<RetrivedContract>((resolve, reject) =>
        fs.readFile(filePath, (err, data) => {
          if (err) {
            return reject(err);
          }
  
          const file: RetrivedContract = {
            path: filePath,
            artifact: data,
            name: path.basename(filePath),
          };
  
          resolve(file);
        })
      );
    
    const rx = from(promise).pipe(
      catchError(() => of(undefined)),
    );

    return rx;
  });

  return await zip(...rxs).pipe(
    map(files => files.filter(Boolean)),
  ).toPromise() as RetrivedContract[];
}

export async function checkContractExist(): Promise<boolean> {
  const filePaths = await retiveContractPaths();

  const rxs = filePaths.map(path => {
    const promise = new Promise<boolean>((resolve, reject) => {
      fs.access(path, err => {
        if (err) {
          reject(err);
        }
  
        resolve(true);
      });
    });

    const rx = from(promise).pipe(
      catchError(e => of(false)),
    );

    return rx;
  });

  return await zip(...rxs).pipe(
    map(checks => checks.every(Boolean)),
  ).toPromise();
}

export async function retiveContracts (): Promise<RetrivedContract[]> {
  const filePaths = await retiveContractPaths();

  console.log('filePaths', filePaths);
  return readFiles(filePaths)
}