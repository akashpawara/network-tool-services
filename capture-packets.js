var Cap = require('cap').Cap;
const nodemailer = require('nodemailer');
var decoders = require('cap').decoders;
var PROTOCOL = decoders.PROTOCOL;
 
var c = new Cap();
var device = Cap.findDevice('192.168.2.7');
var filter = 'tcp and dst port 80';
var bufSize = 10 * 1024 * 1024;
var buffer = Buffer.alloc(65535);
 
var linkType = c.open(device, filter, bufSize, buffer);
 
c.setMinBytes && c.setMinBytes(0);
 
c.on('packet', function(nbytes, trunc) {
    let transporter = nodemailer.createTransport({
        host: `smtp.ethereal.email`,
        port: 587,
        secure: false, 
        auth: {
          user: "hoyt62@ethereal.email", 
          pass: "PzAEaGHFnwY45rnnKq" 
        }
    });
      
    const mailOptions = { 
        from: 'hoyt62@ethereal.email',      
        to: 'yogitajatla@gmail.com',          
        subject: 'Packets',  
        html: `<p>Packet: length `+nbytes+` bytes recieved to </p>`
    };

    transporter.sendMail(mailOptions, function (err, info) {
        // console.log("test");
        if(err) 
          console.log(err);
        else
          console.log(info);     
    });

    console.log('packet: length ' + nbytes + ' bytes, truncated? '
              + (trunc ? 'yes' : 'no'));
 

 
  if (linkType === 'ETHERNET') {
    var ret = decoders.Ethernet(buffer);
 
    if (ret.info.type === PROTOCOL.ETHERNET.IPV4) {
      console.log('Decoding IPv4 ...');
 
      ret = decoders.IPV4(buffer, ret.offset);
      console.log('from: ' + ret.info.srcaddr + ' to ' + ret.info.dstaddr);
 
      if (ret.info.protocol === PROTOCOL.IP.TCP) {
        var datalen = ret.info.totallen - ret.hdrlen;
 
        console.log('Decoding TCP ...');
 
        ret = decoders.TCP(buffer, ret.offset);
        console.log(' from port: ' + ret.info.srcport + ' to port: ' + ret.info.dstport);
        console.log('Report send to yogitajatla@gmail.com')
        datalen -= ret.hdrlen;
        console.log(buffer.toString('binary', ret.offset, ret.offset + datalen));
      } else if (ret.info.protocol === PROTOCOL.IP.UDP) {
        console.log('Decoding UDP ...');
 
        ret = decoders.UDP(buffer, ret.offset);
        console.log(' from port: ' + ret.info.srcport + ' to port: ' + ret.info.dstport);
        console.log(buffer.toString('binary', ret.offset, ret.offset + ret.info.length));
      } else
        console.log('Unsupported IPv4 protocol: ' + PROTOCOL.IP[ret.info.protocol]);
    } else
      console.log('Unsupported Ethertype: ' + PROTOCOL.ETHERNET[ret.info.type]);
  }
});