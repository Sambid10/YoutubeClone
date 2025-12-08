import { db } from '@/db'
import { users } from '@/db/schema'
import { auth } from '@clerk/nextjs/server'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import React from 'react'

export default async function RedirectToUserProfile() {
    const session=await auth()
    if (!session.userId) return
    const [user] = await db.select().from(users).where(eq(users.clerkId,session.userId))
    return redirect(`user/${user.id}`)
}
