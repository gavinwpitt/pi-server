// @ts-ignore
import { execSync, ChildProcess }  from 'child_process';

class RfRemote {
    private onSwitchCodeMap:number[];
    private offSwitchCodeMap:number[];

    constructor() {
        this.onSwitchCodeMap = [
            parseInt(process.env.RF_SWITCH_1_ON_CODE || ""),
            parseInt(process.env.RF_SWITCH_2_ON_CODE || ""),
            parseInt(process.env.RF_SWITCH_3_ON_CODE || ""),
            parseInt(process.env.RF_SWITCH_4_ON_CODE || ""),
            parseInt(process.env.RF_SWITCH_5_ON_CODE || "")
        ];

        this.offSwitchCodeMap = [
            parseInt(process.env.RF_SWITCH_1_OFF_CODE || ""),
            parseInt(process.env.RF_SWITCH_2_OFF_CODE || ""),
            parseInt(process.env.RF_SWITCH_3_OFF_CODE || ""),
            parseInt(process.env.RF_SWITCH_4_OFF_CODE || ""),
            parseInt(process.env.RF_SWITCH_5_OFF_CODE || "")
        ];
    }

    async switch(on:boolean, switchNumbers:number[]) {
        let codes:number[] = on ? this.onSwitchCodeMap : this.offSwitchCodeMap;

        switchNumbers.forEach((switchNumber) => {
            this.callRfSwitchCommand(codes[switchNumber - 1]);
        });
    }

    async callRfSwitchCommand(switchCode:number) {
        let command = `/var/www/html/rfoutlet/codesend ${switchCode} -l ${188} -p ${0}`;
        execSync(command);          
    }
}

export default RfRemote;