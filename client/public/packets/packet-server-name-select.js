class PacketServerNameSelect extends Packet {
    constructor(name) {
        super(0x02, PacketType.SERVER_BOUND);
        this.name = name;
    }
}


if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = { PacketServerNameSelect };
} else {
    window.PacketServerNameSelect = PacketServerNameSelect;
}