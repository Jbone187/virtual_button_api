const axios = require("axios");
const https = require("https");
const notifier = require("mail-notifier");

const imap = {
  user: "a#####",
  password: "##########!",
  host: "j######",
  port: 993, // imap port
  tls: true, // use secure connection
  tlsOptions: {
    rejectUnauthorized: false,
  },
};

notifier(imap)
  .on("mail", (mail) => console.log(mail))
  .start();

const n = notifier(imap);

n.on("end", () => n.start())
  .on("mail", function (mail) {
    if (
      mail.subject === "Arlo Secure: Person detected on Front Door" ||
      mail.subject === "Arlo Secure: Person detected on Front Side"
    ) {
      console.log(mail.from[0].address, mail.subject);

      const agent = new https.Agent({
        rejectUnauthorized: false,
      });

      axios.get(
        "https://api.virtualbuttons.com/v1?",
        { httpsAgent: agent }
      );

      console.log("Virtual Button Api Running");
    } else {
      console.log("Waiting on Data");
    }
  })
  .start();
