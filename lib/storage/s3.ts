import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

const R2_ENDPOINT = process.env.R2_ENDPOINT!
const R2_ACCESS_KEY = process.env.R2_ACCESS_KEY!
const R2_SECRET_KEY = process.env.R2_SECRET_KEY!
const R2_BUCKET = process.env.R2_BUCKET || "hcloud"

let s3Client: S3Client | null = null

function getS3Client(): S3Client {
  if (!s3Client) {
    s3Client = new S3Client({
      region: "auto",
      endpoint: R2_ENDPOINT,
      credentials: {
        accessKeyId: R2_ACCESS_KEY,
        secretAccessKey: R2_SECRET_KEY,
      },
      forcePathStyle: true,
    })
  }
  return s3Client
}

export async function getUploadPresignedUrl(key: string, contentType: string, expiresIn = 3600): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
    ContentType: contentType,
  })
  return getSignedUrl(getS3Client(), command, { expiresIn })
}

export async function getDownloadPresignedUrl(key: string, expiresIn = 3600): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
  })
  return getSignedUrl(getS3Client(), command, { expiresIn })
}

export async function deleteObject(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
  })
  await getS3Client().send(command)
}

export async function headObject(key: string) {
  try {
    const command = new HeadObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
    })
    return await getS3Client().send(command)
  } catch {
    return null
  }
}

export function generateStorageKey(userId: string, checksumSha256: string, originalName: string): string {
  const ext = originalName.split(".").pop() || ""
  const timestamp = Date.now()
  return `users/${userId}/${checksumSha256.slice(0, 16)}_${timestamp}.${ext}`
}

export function generateDedupKey(checksumSha256: string): string {
  return `dedup/${checksumSha256.slice(0, 2)}/${checksumSha256}`
}
