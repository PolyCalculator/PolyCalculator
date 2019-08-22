const { RichEmbed } = require('discord.js');

class Fight {
    constructor(aname, ahp, amaxhp, aattack, dname, dhp, dmaxhp, ddef, dbonus, dretal) {
        this.aname = aname
        this.ahp = ahp;
        this.amaxhp = amaxhp;
        this.aattack = aattack;
        this.dname = dname;
        this.dhp = dhp;
        this.dmaxhp = dmaxhp;
        this.ddef = ddef;
        this.dbonus = dbonus;
        if(dname === "Mooni" || dname === "Mind Bender")
            this.dretal = false;
        else
            this.dretal = dretal;
        this.aforce = this.aattack*this.ahp/this.amaxhp;
        this.dforce = this.ddef*this.dhp/this.dmaxhp*this.dbonus;
    }
  
    calculate() {
        let deadText = ['DRANK RED RUM', 'UTOP\'D', 'MET MIDJIWAN', 'FOLLOWED REAPERSTORMENT', 'BOMBED', 'SQUEEGEED', 'CLEANED', 'VACUMMED', 'DISSECTED', 'BLASTED', 'SHATTERED', 'TORPEDOED', 'SPLINTERED', 'FRAGMENTED', 'TOTALED', 'TRASHED', 'BATTERED', 'BUSTED', 'CLEAVED', 'OLD BARDUR\'D', 'VITIATED', 'NULLIFIED', 'ANNULED', 'SPITTED', 'PINGED NELLUK', 'INCINERATED', 'SQUASHED', 'GRATED', 'FLAYED', 'SNIPED', 'REDACTED', 'DETONATED', 'ROASTED', 'ASPHYXIATED', 'CAPPED', 'CONDENSED', 'HUGGED', 'IRONED', 'GORED', 'STEAMROLLED', 'FLATTENED', 'DISSOLVED', 'REKT', 'REMOVED', 'SHIVVED', 'GUTTED', 'NEUTRALIZED', 'PUT DOWN', 'SNUFFED', 'ICED', 'SPINDLED', 'FOLDED', 'MUTILATED', 'STAPLED', 'CLIPPED', 'WARPED', 'WRECKED', 'JAMED', 'SCRATCHED', 'SLAIN', 'MASSACRED', 'SHREDDED', 'BIG OOF', 'DESTROZADO', 'DECIMATED', 'DECAPITATED', 'CRUSHED', 'BLENDED', 'DISMEMBERED', 'DESTROYED', 'MAULED', 'SCHOOLED', 'SHELLED', 'DEAD', 'ELIMINATED', 'MURDERED', 'STEAMED', 'SMOKED', 'DELETED']
        let randomText = deadText[Math.floor(Math.random() * deadText.length)];
        var totaldam = this.aforce+this.dforce;
        var defdiff = Math.round(this.aforce / totaldam * this.aattack * 4.5);
        var hpdefender = this.dhp - defdiff;
        let attdiff = 0
        var hpattacker
        if(hpdefender <= 0) {
            hpattacker = this.ahp;
            hpdefender = deadText[Math.floor(Math.random() * deadText.length)];
        } else if(this.dretal === false) {
            hpattacker = this.ahp
            this.aname = this.aname + " (no retaliation)"
        } else {
            attdiff = Math.round(this.dforce / totaldam * this.ddef * 4.5)
            hpattacker = this.ahp - attdiff;
        }

        if(hpattacker <= 0) {
            hpattacker = randomText;
        }
        console.log(`${hpattacker} / ${this.aname}`)
        console.log(`${hpdefender} / ${this.dname}`)
        console.log(`${this.dbonus} / ${this.dretal}`)

        const helpEmbed = new RichEmbed()
            .setColor('#FA8072')
            .addField(`**${this.aname}**:`, `${hpattacker} (${attdiff*-1})`)
            .addField(`**${this.dname}**:`, `${hpdefender} (${defdiff*-1})`)

        if(this.aname === 'Fire Dragon') {
            helpEmbed.addField(`**Splash damage**:`, Math.floor(defdiff/2))
        }

        return helpEmbed;
    }
}

module.exports = Fight;