import fs from 'node:fs';
import fastCsv from 'fast-csv';

const resultData = [];

const processAndInsertData = async (rows) => {
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      resultData.push(...rows);
      resolve('');
    }, 1000);
  });
};

const execute = async () => {
  const fileStream = fs.createReadStream('./4050-users.csv');

  const parserStream = fastCsv.parse({
    delimiter: ',',
    quote: '"',
    objectMode: true,
    strictColumnHandling: true,
  });

  fileStream.pipe(parserStream);

  const BATCH_SIZE = 1_000;

  let isReadHeader = true;
  let rows = [];

  parserStream.on('data', async (chunk) => {
    // skip first line with header
    if (isReadHeader) {
      isReadHeader = false;

      return;
    }

    // collect batch
    rows.push(chunk);

    // process full batch
    if (rows.length === BATCH_SIZE) {
      console.log(rows.length);

      const rowsCopy = rows.slice(0, rows.length);

      rows = [];

      await processAndInsertData(rowsCopy);
    }
  });

  await new Promise((resolve, reject) => {
    // process rest of batch
    parserStream.on('end', async () => {
      if (rows.length) {
        console.log(rows.length);

        const rowsCopy = rows.slice(0, rows.length);

        rows = [];

        await processAndInsertData(rowsCopy);
      }

      resolve();
    });
  });
};

(async () => {
  await execute();

  console.log({ resultDataLength: resultData.length });
})();
