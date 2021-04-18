function isatty(fd) {
    if (typeof fd !== "number") {
        return false;
    }
    try {
        return Deno.isatty(fd);
    }
    catch (_) {
        return false;
    }
}
export { isatty };
export default { isatty };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHR5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidHR5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU1BLFNBQVMsTUFBTSxDQUFDLEVBQVU7SUFDeEIsSUFBSSxPQUFPLEVBQUUsS0FBSyxRQUFRLEVBQUU7UUFDMUIsT0FBTyxLQUFLLENBQUM7S0FDZDtJQUNELElBQUk7UUFDRixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDeEI7SUFBQyxPQUFPLENBQUMsRUFBRTtRQUNWLE9BQU8sS0FBSyxDQUFDO0tBQ2Q7QUFDSCxDQUFDO0FBS0QsT0FBTyxFQUFFLE1BQU0sRUFBRSxDQUFDO0FBQ2xCLGVBQWUsRUFBRSxNQUFNLEVBQUUsQ0FBQyJ9