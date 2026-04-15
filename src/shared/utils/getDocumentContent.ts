import { Document } from "@/features/billing/models/document";


export default function getDocumentContent(document: Document){
    switch(document.storageMode){
        case "CLOUD_URL": return document.storageURL
        case "FILESYSTEM": return document.storageURL
        case "DATABASE": return document.storageURL
    }
}