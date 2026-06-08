import asyncio
from core.db import init_pool

# Import fetch modules
from fetch import (
    tujuan,
    indikator_tujuan,
    sasaran,
    indikator_sasaran,
    program,
    indikator_program,
    kegiatan,
    kegiatan_output,
    subkegiatan,
)

# Import helper functions from original code base that provide lists
# The original module had helper functions like get_opd_list() etc.
# We expect the original `fetch_all_renstra.py` to remain available with those functions,
# or users can implement adapters returning the required lists.
try:
    from fetch_all_renstra import (
        get_opd_list,
        get_subopd_list,
        get_tujuan_list,
        get_program_list,
        get_kegiatan_list,
        get_kegiatan_output_list,
    )
except Exception:
    # If adapter isn't available, provide simple empty implementations
    def get_opd_list():
        return []

    def get_subopd_list():
        return []

    def get_tujuan_list():
        return []

    def get_program_list():
        return []

    def get_kegiatan_list():
        return []

    def get_kegiatan_output_list():
        return []

async def run_all():
    init_pool()
    await tujuan.run(get_opd_list)
    await indikator_tujuan.run(get_tujuan_list)
    await sasaran.run(get_opd_list)
    await indikator_sasaran.run(get_program_list)
    await program.run(get_subopd_list)
    await indikator_program.run(get_program_list)
    await kegiatan.run(get_program_list)
    await kegiatan_output.run(get_kegiatan_list)
    await subkegiatan.run(get_kegiatan_output_list)

if __name__ == "__main__":
    asyncio.run(run_all())
