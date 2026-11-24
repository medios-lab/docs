---
title: Build from Source
doc_type: how-to
---

# Build from Source

You end with compiled `medios-controller`, `medios-node`, `medios-execute`, and helper binaries in `build/src/`, verified by `ctest`.

## Before you begin

- **CMake 3.24+:** Ubuntu 24.04 ships 3.28; Ubuntu 22.04 ships 3.22 and requires a manual upgrade.
- **C++20 compiler:** `g++` 13+, `clang` 18+, or Apple Clang from Xcode 15+.
- **Ninja 1.10+**.
- **OpenSSL 3 development headers:** `libssl-dev` on Ubuntu, or `openssl@3` from Homebrew on macOS.
- **ccache** (optional, recommended for incremental rebuilds).

On macOS:

```sh
brew install cmake ninja ccache openssl@3
```

## 1. Clone the repository

```sh
git clone https://github.com/medios-lab/medios.git
cd medios
```

## 2. Configure with CMake and Ninja

On Linux:

```sh
cmake -B build -G Ninja \
  -DCMAKE_BUILD_TYPE=RelWithDebInfo \
  -DMEDIOS_BUILD_TESTS=ON \
  -DCMAKE_C_COMPILER_LAUNCHER=ccache \
  -DCMAKE_CXX_COMPILER_LAUNCHER=ccache
```

On macOS (pin OpenSSL 3 explicitly, because Homebrew defaults to OpenSSL 4):

```sh
cmake -B build -G Ninja \
  -DCMAKE_BUILD_TYPE=RelWithDebInfo \
  -DMEDIOS_BUILD_TESTS=ON \
  -DOPENSSL_ROOT_DIR=$(brew --prefix openssl@3) \
  -DCMAKE_C_COMPILER_LAUNCHER=ccache \
  -DCMAKE_CXX_COMPILER_LAUNCHER=ccache
```

Pass `-DMEDIOS_BUILD_TESTS=OFF` if you only need the binaries. Pass `-DMEDIOS_ENABLE_SSL=ON` to compile libprocess mutual TLS support.

## 3. Compile

Each C++ translation unit peaks at 1–2 GiB of RAM. Pick `-j` for your host memory:

| Host RAM | Recommended `-j` |
| --- | --- |
| 16 GiB (Apple Silicon or Linux) | `-j 2` |
| 32 GiB | `-j 4` to `-j 8` |
| 64 GiB+ | `-j $(nproc)` |

```sh
cmake --build build -j 4
```

## 4. Run the test suite

```sh
ctest --test-dir build --output-on-failure
```

Run a single test target:

```sh
ctest --test-dir build -R HelloWorld --output-on-failure
```

## Clean up

Remove the build directory to reclaim disk space:

```sh
rm -rf build
```

## What's next

- [Quick-Start Guide](/quick-start)
- [Mutual TLS (mTLS)](/security/tls)
