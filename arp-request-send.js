var Cap = require('cap').Cap;
var c = new Cap();
var device = Cap.findDevice('192.168.2.7');
var filter = 'arp';
var bufSize = 10 * 1024 * 1024;
var buffer = Buffer.alloc(65535);
 
var linkType = c.open(device, filter, bufSize, buffer);
 
var buffer = Buffer.from([
    // ETHERNET
    0xff, 0xff, 0xff, 0xff, 0xff,0xff,                  // 0    = Destination MAC
    0xf4, 0x8e, 0x38, 0xf3, 0x5d, 0x38,                 // 6    = Source MAC
    0x08, 0x06,                                         // 12   = EtherType = ARP
    // ARP
    0x00, 0x01,                                         // 14/0   = Hardware Type = Ethernet (or wifi)
    0x08, 0x00,                                         // 16/2   = Protocol type = ipv4 (request ipv4 route info)
    0x06, 0x04,                                         // 18/4   = Hardware Addr Len (Ether/MAC = 6), Protocol Addr Len (ipv4 = 4)
    0x00, 0x01,                                         // 20/6   = Operation (ARP, who-has)
    0x7c, 0x67, 0xa2, 0xeb, 0xed, 0x8f,                 // 22/8   = Sender Hardware Addr (MAC)
    0xc0, 0xa8, 0x01, 0xc8,                             // 28/14  = Sender Protocol address (ipv4)
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00,                 // 32/18  = Target Hardware Address (Blank/nulls for who-has)
    0xc0, 0xa8, 0x01, 0xc9                              // 38/24  = Target Protocol address (ipv4)
]);
 
try {
  c.send(buffer, buffer.length);
} catch (e) {
  console.log("Error sending packet:", e);
}