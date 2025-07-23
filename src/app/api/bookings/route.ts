
import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    const body = await req.json()
    // console.log('Received booking request:', body);
    const { resourceId, startTime, endTime, requestedBy } = body

    const start = new Date(startTime)
    const end = new Date(endTime)

    // 🛡 Basic Validations
    if (end <= start) {
        return NextResponse.json({ error: 'End time must be after start time.' }, { status: 400 })
    }

    const duration = (end.getTime() - start.getTime()) / (1000 * 60)
    if (duration < 15) {
        return NextResponse.json({ error: 'Booking must be at least 15 minutes long.' }, { status: 400 })
    }

    // 🧠 10-minute buffer in milliseconds
    const bufferMs = 10 * 60 * 1000
    const startWithBuffer = new Date(start.getTime() - bufferMs)
    const endWithBuffer = new Date(end.getTime() + bufferMs)

    // 🧩 Conflict detection logic
    const conflict = await prisma.booking.findFirst({
        where: {
            resourceId,
            startTime: {
                lt: endWithBuffer,
            },
            endTime: {
                gt: startWithBuffer,
            },
        },
    })

    if (conflict) {
        return NextResponse.json({ error: 'Time slot conflicts with existing booking (buffer rule applied).' }, { status: 409 })
    }

    // ✅ Save booking
    const booking = await prisma.booking.create({
        data: {
            resourceId,
            startTime: start,
            endTime: end,
            requestedBy,
        },
    })

    return NextResponse.json(booking)
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const resourceId = searchParams.get('resourceId') ?? undefined
    const date = searchParams.get('date') ?? undefined

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filters: any = {}

    if (resourceId) filters.resourceId = resourceId
    if (date) {
        const startOfDay = new Date(date)
        const endOfDay = new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000)

        filters.startTime = {
            gte: startOfDay,
            lt: endOfDay,
        }
    }

    const bookings = await prisma.booking.findMany({
        where: filters,
        orderBy: {
            startTime: 'asc',
        },
    })

    return NextResponse.json(bookings)
}
