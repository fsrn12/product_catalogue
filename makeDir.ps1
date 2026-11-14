$folders = @(
    "src/domain/entities",
    "src/domain/errors",
    "src/domain/ports/repositories",
    "src/domain/ports/services",
    "src/domain/value-objects",
    "src/application/dtos",
    "src/application/services",
    "src/application/context",
    "src/infrastructure/database/mongoose",
    "src/infrastructure/security",
    "src/infrastructure/logging",
    "src/infrastructure/cache",
    "src/interfaces/http/controllers",
    "src/interfaces/http/middlewares",
    "src/interfaces/http/routes",
    "tests/unit",
    "tests/integration",
    "tests/e2e",
    "docker",
    "jenkins"
)

foreach ($folder in $folders) {
      New-Item -ItemType Directory -Force -Path $folder | Out-Null
}
