# Deno exec(v|p|e)

Exec lib to make ffi calls to syscall.exec* family of functions.

```typescript
import { exec } from 'https://raw.githubusercontent.com/zph/exec/main/main.ts'

// Execute ls with arguments and inject FOO environmental variable
exec(["ls", "-la", "."], {FOO: "bar"})
```

## Project Maturity

Nascent and minimally tested but simple to try and validate for an individual use case.

## Coverage of exec family syscalls:

| Implemented (T/F) | Function Signature |
|------------------|--------------------|
| T                | int execv(char const *path, char const *argv[]); |
| T*               | int execve(char const *path, char const *argv[], char const *envp[]); |
| T                | int execvp(char const *file, char const *argv[]); |
| F                | int execl(char const *path, char const *arg0, ...); |
| F                | int execle(char const *path, char const *arg0, ..., char const *envp[]); |
| F                | int execlp(char const *file, char const *arg0, ...); |
| F                | int fexecve(int fd, char *const argv[], char *const envp[]); |

*: execve is implemented as a wrapper on execvp + Deno.env.set

## Compatibility / Limitations

- Linux & Mac
- No support for Windows compatibility

- Has only been tested on a single version of OSX
- Needs a matrix test harness on GH Actions to validate libc naming assumptions
