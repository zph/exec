/*
   int execl(char const *path, char const *arg0, ...);
   int execle(char const *path, char const *arg0, ..., char const *envp[]);
   int execlp(char const *file, char const *arg0, ...);
   int execv(char const *path, char const *argv[]);
   int execve(char const *path, char const *argv[], char const *envp[]);
   int execvp(char const *file, char const *argv[]);
   int fexecve(int fd, char *const argv[], char *const envp[]);
*/
const libName = Deno.build.os === "linux" ? "libc.so.6" : "libc.dylib";

if(Deno.build.os === "windows") {
  throw new Error("Not supported on Windows")
}

const { symbols } = Deno.dlopen(libName, {
  execv: {
    parameters: ["buffer", "buffer"],
    result: "i32",
  },
  execvp: {
    parameters: ["buffer", "buffer"],
    result: "i32",
  },
});

const nullTerminateStringAsBuffer = (str: string) => {
  const encoder = new TextEncoder();
  return encoder.encode(str + "\0").buffer;
}

const stringsToNullTerminatedPointerArray = (strings: string[]) => {
  const encoder = new TextEncoder();
  const buffers = strings.map((str) => encoder.encode(str).buffer);
  const ptrs = buffers.map((b) => Deno.UnsafePointer.of(b)).map((ptr) => BigInt(Deno.UnsafePointer.value(ptr)));
  return new BigUint64Array([...ptrs, 0n]);
}

const __exec = (type: "execv" | "execvp", path: string, args: string[]):  number | never => {
  const argv0 = nullTerminateStringAsBuffer(path)
  const argvBuffer = stringsToNullTerminatedPointerArray(args);

  return symbols[type](argv0, argvBuffer);
}

export const execv = (path: string, args: string[]): number | never => __exec("execv", path, args);
export const execvp = (path: string, args: string[]): number | never => __exec("execvp", path, args);
export function exec(args: string[], env: {[key: string]: string} = {}): number | never {
  for (const [key, value] of Object.entries(env)) {
    // Execvp inherits environment variables from the parent process
    // so we set these via the Deno API
    Deno.env.set(key, value)
  }
  return execvp(args[0], args)
}
