SELECT 
  t.idtujuan,
o.id_pd,
t.kodepemda,
t.idperiode,
2026 as tahun,
t.kodeskpd,
t.no_urut as  nomor,
t.uraitujuan,
t.daftar_bidang,
t.sasaran_rpjmd,
'-' as ket
FROM
  public.renstra_tujuan t
  INNER JOIN public.ta_opd o ON (t.kodeskpd = o.kode);


SELECT 
  s.idsasaran,
  o.id_pd,
  s.idtujuan,
s.kodepemda,
s.idperiode,
2026 as tahun,
s.kodeskpd,
s.uraitujuan,
s.urut as nomor,
s.uraisasaran,'' as ket
FROM
  public.renstra_sasaran s
  INNER JOIN public.ta_opd_a o ON (s.kodeskpd = o.kode);




SELECT 
  s.idtujuan_indikator as id,
3 as lvl,
s.idtujuan as id_parent,
2026 as tahun,
o.id_pd as id_sub_pd,
s.no_urut as kode,
s.no_urut as nomor,
s.uraitujuan_indikator as tolok_ukur,
''  as ket,
''  as formula,
s.satuan as satuan,
1 as idformula,
1 as idjenis,
0 as iskota,
s.iku as iku,
1 as kategori,
'' as sumber,
s.target0 as t0,
s.target1 as t1,
s.target2 as t2,
s.target3 as t3,
s.target4 as t4,
s.target5 as t5,
s.target4 as tx,
s.target1 as target_renja,
s.target1 as target_renja_murni,
s.target1 as target,
s.target1 as target_murni,
s.target1 as target_pk,
s.target1 as target_pk_murni,
s.target1 as target_rpj,
s.target4 as target_akhir
FROM
  public.renstra_indikator_tujuan s
  INNER JOIN public.ta_opd_a o ON (s.kodeskpd = o.kode)
  
  UNION ALL
  
  SELECT 
  s.idsasaran_indikator as id,
4 as lvl,
s.idsasaran as id_parent,
2026 as tahun,
o.id_pd as id_sub_pd,
s.no as kode,
s.no as nomor,
s.uraisasaran_indikator as tolok_ukur,
''  as ket,
''  as formula,
s.satuan as satuan,
1 as idformula,
1 as idjenis,
0 as iskota,
s.iku as iku,
1 as kategori,
'' as sumber,
s.target0 as t0,
s.target1 as t1,
s.target2 as t2,
s.target3 as t3,
s.target4 as t4,
s.target5 as t5,
s.target4 as tx,
s.target1 as target_renja,
s.target1 as target_renja_murni,
s.target1 as target,
s.target1 as target_murni,
s.target1 as target_pk,
s.target1 as target_pk_murni,
s.target1 as target_rpj,
s.target4 as target_akhir
FROM
  public.renstra_indikator_sasaran s
  INNER JOIN public.ta_opd_a o ON (s.kodeskpd = o.kode);



SELECT 
  s.id  as id,
5 as lvl,
s.kodeprogram  as kodeprogram,
2026 as tahun,
o.id_pd as id_sub_pd,
s.no as kode,
s.no as nomor,
s.uraiindikator as tolok_ukur,
''  as ket,
''  as formula,
s.satuan as satuan,
1 as idformula,
1 as idjenis,
0 as iskota,
0 as iku,
1 as kategori,
'' as sumber,
s.target0 as t0,
s.target1 as t1,
s.target2 as t2,
s.target3 as t3,
s.target4 as t4,
s.target5 as t5,
s.target4 as tx,
s.target1 as target_renja,
s.target1 as target_renja_murni,
s.target1 as target,
s.target1 as target_murni,
s.target1 as target_pk,
s.target1 as target_pk_murni,
s.target1 as target_rpj,
s.target4 as target_akhir
FROM
  public.renstra_indikator_program  s
  INNER JOIN public.ta_opd_a o ON (s.kodeskpd = o.kode);
  




