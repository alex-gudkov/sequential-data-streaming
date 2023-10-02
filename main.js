import fs from 'node:fs';
import fastCsv from 'fast-csv';

const resultData = [];

async function processAndInsertData(rows) {
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      resultData.push(...rows);

      resolve('');
    }, 1000);
  });
}

async function execute() {
  const fileStream = fs.createReadStream('./4050-users.csv');

  const parserStream = fastCsv.parse({
    delimiter: ',',
    quote: '"',
    objectMode: true,
    strictColumnHandling: true,
    headers: true,
  });

  await new Promise((resolve, reject) => {
    const BATCH_SIZE = 1_000;
    const rows = [];

    fileStream.pipe(parserStream);

    parserStream.on('data', async (chunk) => {
      // collect batch
      rows.push(chunk);

      // process full batch
      if (rows.length === BATCH_SIZE) {
        parserStream.pause();

        console.log(rows.length);

        const rowsCopy = rows.splice(0, rows.length);

        await processAndInsertData(rowsCopy);

        parserStream.resume();
      }
    });

    // process rest of batch
    parserStream.on('end', async () => {
      if (rows.length) {
        parserStream.pause();

        console.log(rows.length);

        const rowsCopy = rows.splice(0, rows.length);

        await processAndInsertData(rowsCopy);

        parserStream.resume();
      }

      resolve();
    });
  });
}

async function main() {
  await execute();

  console.log({ resultDataLength: resultData.length });
}

main();
