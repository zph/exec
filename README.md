# Deno exec(v|p|e)

Exec lib to make ffi calls to syscall.exec family of functions.

Implemented (T/F):

F: int execl(char const *path, char const *arg0, ...);
F: int execle(char const *path, char const *arg0, ..., char const *envp[]);
F: int execlp(char const *file, char const *arg0, ...);
T: int execv(char const *path, char const *argv[]);
T: int execve(char const *path, char const *argv[], char const *envp[]);
T: int execvp(char const *file, char const *argv[]);
F: int fexecve(int fd, char *const argv[], char *const envp[]);

*: execve is implemented as a wrapper on execvp + Deno.env.set
