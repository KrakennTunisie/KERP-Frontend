import { z } from "zod";


export const documentStorageMode = z.enum(["CLOUD_URL", "FILESYSTEM", "DATABASE"])