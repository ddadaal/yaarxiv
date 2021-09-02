import Minio from "minio";

function collectBucketStream<T>(stream: Minio.BucketStream<T>) {
  return new Promise<T[]>((resolve, reject) => {
    const value: T[] = [];
    stream.on("data", (item) => value.push(item));
    stream.on("error", (...err) => reject(...err));
    stream.on("end", () => resolve(value));
  });
}

export async function removePrefix(minio: Minio.Client, bucketName: string, prefix?: string) {
  const stream = minio.listObjectsV2(bucketName, prefix, true);
  const items = await collectBucketStream(stream);
  const itemNames = items.map((x) => x.name);
  await minio.removeObjects(bucketName, itemNames);
  return itemNames;
}

