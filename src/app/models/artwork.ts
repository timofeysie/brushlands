export class Artwork {
    assetRefNo: string;
    title: string;
    artist: string;
    inspected: boolean;
    amountPaid: string;
    imageFileName: string;
    insured: string;
    next: string;
    officeLocation: string;
    previous: string;
    provenance: string;
    size: string;
    text: string;
    thumbnail: string;

    constructor(assetRefno, title, artist) {
        this.assetRefNo = assetRefno;
        this.title = title;
        this.artist = artist;
    }

};