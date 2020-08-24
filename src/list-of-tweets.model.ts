import { AuthorData } from './author-data.model'

export class ListOfTweetsModel {
    tweets:{
        author: AuthorData;
        tweet_id:string;
        tweet_text:string;
    }[]
}