import { NextRequest, NextResponse } from "next/server";

interface ClaimData {
    initial_date: Date;
    time: number;
    window: number;
}

function calculateNextClaim(prizeData: ClaimData): boolean | string {
    const { initial_date, time, window } = prizeData;
    const currentDate = new Date();
    const elapsedTime = currentDate.getTime() - initial_date.getTime();
    const elapsedMinutes = elapsedTime / (1000 * 60);

    // Calcular el número de intervalos de tiempo completados
    const completedIntervals = Math.floor(elapsedMinutes / time);

    // Calcular el próximo tiempo de reclamo
    const nextClaimTime = new Date(initial_date.getTime() + (completedIntervals + 1) * time * 60 * 1000);

    // Verificar si el próximo reclamo está dentro de la ventana de tiempo  windowEndTime = nextClaim + window
    const windowEndTime = new Date(nextClaimTime.getTime() + window * 60 * 1000);

    console.log(nextClaimTime, windowEndTime, currentDate);
    
    if (nextClaimTime <= currentDate && currentDate <= windowEndTime) {
        return true;
    } else {
        const remainingTime = nextClaimTime.getTime() - currentDate.getTime();
        const hours = Math.floor(remainingTime / (1000 * 60 * 60));
        const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

        let dateString = "";

        if(hours > 0) dateString += `${hours} hour${hours > 1 ? "s" : ""} `;
        if(minutes > 0) dateString += `${minutes} minute${minutes > 1 ? "s" : ""} `;
        if(seconds > 0) dateString += `${seconds} second${seconds > 1 ? "s" : ""}`;

        return `${dateString}`;
    }
}

const claimData: ClaimData = {
    initial_date: new Date("2024-03-19T20:29:08+00:00"),
    time: 15,
    window: 1
};



export async function GET(req: NextRequest, res: NextResponse) {
    // Solo permitir el método GET

    try {
        const nextClaimTime = calculateNextClaim(claimData);

        return NextResponse.json({
            message: nextClaimTime == true ? "You can claim a NOF!" : "You can't claim your NOF yet, please wait " + nextClaimTime,
        }, {
            status: 200
        })
    } catch (error) {
        // Manejar los errores
        return NextResponse.json({
            message: 'Server error'
        }, {
            status: 500
        })
    }
}
