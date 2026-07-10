export default function Footer() {
    return (
        <footer classname="border-t border-neutral-200 bg-neutral-50">
            <div className="mx-auto max-w-7xl px-6 text-sm text-neutral-500">
                <p>&copy; {new Date().getFullYear()} Aliy's. All Rights reserved</p>
            </div>
        </footer>
    )
}