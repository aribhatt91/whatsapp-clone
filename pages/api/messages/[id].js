import { getMessagesForRoom } from "../../../lib/messages";

const handler = (req, res) => {
    const { query, body, headers, cookies } = req;
    const { id } = query;
    const { lastIndex=null } = body;
    if(!id){
        /* Error */
    }

    console.log(req);
    res.status(200).json({ name: query, cookies, body })
}

export default handler;