export class Artwork {
    assetRefNo: string;
    title: string;
    artist: string;
    inspected: boolean;

    constructor(assetRefno, title, artist) {
        this.assetRefNo = assetRefno;
        this.title = title;
        this.artist = artist;
        this.inspected = false;
    }

};