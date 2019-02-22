export default function(context, parameter) {
	const address = this.getAddress(context, parameter);
	return context.memory.readAt(address);
}
