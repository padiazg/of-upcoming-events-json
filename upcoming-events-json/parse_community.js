const moment = require("moment");

// matches the hole block containing the events table
const regex_events_block = /(#### Events in 2018\n.*\n\n(\|.*?\|.*?\|.*?\|.*?\|\n)+)/m

// Matches a line of the table
const regex_event = /(\|.*?\|.*?\|.*?\|.*?\|\n)/mg

/* Examples of matching items, the Event name and description field can be
a plain text or a link
| [KubeCon + CloudNativeCon: Digital Transformation of Vision Banco Paraguay with Serverless Functions](https://sched.co/GraO) | Alex Ellis & Patricio Diaz | Seattle, WA | 13-Dec-2018 |
| Exploring the serverless framework with OpenFaaS @ DevFest Nantes | [Emmanuel Lebeaupin](https://twitter.com/elebeaup) | Nantes, France | 19-Oct-2018 |
| Serverless OpenFaaS and Python Workshop @ Agile Peterborough        | Alex Ellis, Richard Gee  | Peterborough, UK | 12-May-2018 |
*/
const regex_fields = /\|\s+\[?(.+?)\]?(\(.+?\))?\s+\|(.+?)\|(.+?)\|(.+?)\|/

module.exports = markdowm => new Promise((resolve, reject) => {
    // get the block containing the events table
    const [events_block] = markdowm.match(regex_events_block);
    // extract each event from the table, title goes as first item, head separator
    // is discarded by regex pattern
    const events = [];
    let event_block;
    while (event_block = regex_event.exec(events_block)) {
        const event = event_block[0];

        // parse the table row into fields
        const fields = regex_fields.exec(event);
        if (fields) {
            //"12-May-2018" => "2018-05-12"
            const _date = moment(fields[5].trim(), "DD-MMM-YYYY");
            const date = _date.isValid() ? _date.format("YYYY-MM-DD") : "";
            events.push({
                event: fields[1],
                link: fields[2] ? fields[2].replace("(","").replace(")","") : "",
                speaker: fields[3].trim(),
                location: fields[4].trim(),
                date
            })
        }
        // else {
        //     console.log(event);
        //     console.log(fields);
        // }
    } // while (event_block = regex_event.exec(events_block)) ...

    if (events.lentgh > 1) {
        events.shift(); // drop first element = parsed title
    }

    resolve(events);
});
