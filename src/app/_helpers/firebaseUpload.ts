import { Injectable } from '@angular/core'
import { AngularFireStorage } from '@angular/fire/compat/storage'

@Injectable()
export class FirebaseUpload {
  constructor(private fireStorage: AngularFireStorage) {}

  async uploadImageChapter(file: any, storyName: string, chapterNumber: number, fileName: number) {
    if (!file) return null
    const path = `data/${storyName}/${chapterNumber.toString()}/${fileName.toString()}`
    const uploadTask = await this.fireStorage.upload(path, file)
    const url = await uploadTask.ref.getDownloadURL()
    return url
  }

  async uploadImageAvatar(file: any, fileName: string) {
    if (!file) return null
    const path = `avatar/${fileName.toString()}`
    const uploadTask = await this.fireStorage.upload(path, file)
    const url = await uploadTask.ref.getDownloadURL()
    return url
  }
}
