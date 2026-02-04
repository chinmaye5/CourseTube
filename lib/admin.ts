import { currentUser } from '@clerk/nextjs/server';
import { ADMIN_EMAIL } from './constants';

export async function isAdmin() {
    try {
        const user = await currentUser();
        if (!user) return false;

        return user.emailAddresses.some(
            (email) => email.emailAddress === ADMIN_EMAIL
        );
    } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
    }
}
