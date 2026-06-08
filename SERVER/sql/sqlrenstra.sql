/* TUJUAN */
SELECT 
  t.idtujuan as id,
  2 as kd_tahap,
  o.id_sub_pd,
  t.no_urut as kd_tujuan,
  t.uraitujuan as tujuan
FROM
  public.renstra_tujuan t
  INNER JOIN public.ta_opd o ON (t.kodeskpd = o.kode);

/* SASARAN */

  SELECT 
  s.idsasaran as id,
  2 as kd_tahap,
  o.id_sub_pd,
  1 as kd_tujuan,
  s.no as kd_sasaran,
  s.uraisasaran as sasaran
FROM
  public.renstra_sasaran s
  INNER JOIN public.ta_opd_a o ON (s.kodeskpd = o.kode)


  /* IDNIKATOR TUJUAN & SASARAN*/
  SELECT 
  it.idtujuan_indikator AS id,
  3 AS lvl,
  it.idtujuan AS id_parent,
  2025 AS tahun,
  o.id_sub_pd,
   it.urut as kode,
    it.urut as nomor,
  it.uraitujuan_indikator as tolok_ukur,
  it.satuan,
  1 as idjenis, 1 as kategori,
  it.target_awal as t0,
  it.target0 as t1,
  it.target1 as t2,
  it.target2 as t3,
  it.target3 as t4,
  it.target4 as t5,
  it.target4 as tx,
 it.target0 as target_renja,
  it.target0 as target_renja_murni,
   it.target0 as target,
    it.target0 as target_murni,
    2 as kd_tahap
FROM
  public.renstra_indikator_tujuan it
  INNER JOIN public.ta_opd_a o ON (it.kodeskpd = o.kode)

UNION ALL
SELECT 
  it.idsasaran_indikator AS id,
  4 AS lvl,
  it.idsasaran AS id_parent,
  2025 AS tahun,
  o.id_sub_pd,
   it.urut as kode,
    it.urut as nomor,
  it.uraisasaran_indikator as tolok_ukur,
  it.satuan,
  1 as idjenis, 1 as kategori,
  it.target_awal as t0,
  it.target0 as t1,
  it.target1 as t2,
  it.target2 as t3,
  it.target3 as t4,
  it.target4 as t5,
  it.target4 as tx,
 it.target0 as target_renja,
  it.target0 as target_renja_murni,
   it.target0 as target,
    it.target0 as target_murni,
    2 as kd_tahap
FROM
  public.renstra_indikator_sasaran it
  INNER JOIN public.ta_opd_a o ON (it.kodeskpd = o.kode)



  /*------- INDIKATOR PROGRAM */
  SELECT
    ip.kodeindikator       AS id,
    o.id_sub_pd,
    5                      AS lvl,
    2                      AS kd_tahap,
    ip.no                  AS kode,
    ip.no                  AS nomor,
    ip.uraiindikator       AS tolok_ukur,
    ip.satuan,
    1                      AS idjenis,
    1                      AS kategori,
    ip.target_awal         AS t0,
    ip.target0             AS t1,
    ip.target1             AS t2,
    ip.target2             AS t3,
    ip.target3             AS t4,
    ip.target4             AS t5,
    ip.target4             AS tx,
    ip.target0             AS target_renja,
    ip.target0             AS target_renja_murni,
    ip.target0             AS target,
    ip.target0             AS target_murni,
    pg.idprogram           AS id_parent
FROM public.renstra_indikator_program ip
JOIN public.ta_opd_a o
    ON ip.kodeskpd = o.kode
JOIN public.renja_program pg
    ON pg.id_sub_pd   = o.id_sub_pd
   AND pg.kode_program = ip.kodeprogram;
