declare module 'ldrs' {
    export const newtonsCradle: {
        register(): void;
    };
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'l-newtons-cradle': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
                size?: string | number;
                speed?: string | number;
                color?: string;
            }, HTMLElement>;
        }
    }
}

