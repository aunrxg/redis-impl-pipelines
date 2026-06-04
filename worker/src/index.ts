import { createClient } from "redis";

const client = createClient();

async function processSubmission(submission: string) {
  const { problemId, code, lang } = JSON.parse(submission);

  console.log("Processing the problem : ", problemId);
  console.log('Code: ', code);
  console.log('language: ', lang);

  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log("Finished processing submisssion for problemid ", problemId);
}

async function startWorker() {
  try {
    await client.connect();
    console.log("Redis connected");

    while(true) {
      try {
        const submission = await client.brPop("Problems", 0);
        await processSubmission(submission.element);
      } catch (error) {
        console.error("error processing subm: ", error);
      }
    }
  } catch (error) {
    console.log("Failed to connected to redis ", error);
  }
}

startWorker();