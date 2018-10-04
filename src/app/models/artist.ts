export class Artist {
    name: string;
    skinName: string;
    language: string;
    region: string;
    dreaming: string;
    DOB: string;
    bio: {
        title: string,
        body: string,
        AASDLink: string,
        WikiLink: string
    };

    constructor(name: string) {
        this.name = name;
        this.bio = {title: null, body: null, AASDLink: null, WikiLink: null};
    }
}