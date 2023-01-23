import { Footer, Navbar } from '.';
import { Container, Divider, Meta } from 'lib/components';
import { PropsWithChildren } from 'react';

type Props = PropsWithChildren & { title?: string };

export function MainLayout({ children, title }: Props) {
	return (
		<>
			<style jsx global>
				{`
					:root {
						--tw-color-dark--theme: #191a20;
					}
				`}
			</style>

			<Meta title={title} />
			<Navbar className="fixed z-[999]" />

			<div className="w-full flex flex-col items-start justify-between h-screen min-h-[500px] pt-20">
				<div className="flex-1 w-full">{children}</div>

				<Container>
					<Divider />
					<Footer className="justify-between px-0" />
				</Container>
			</div>
		</>
	);
}