SELECT idprogram,kode_bidang_urusan,kode_program,nm_program,sum(anggaran) as anggaran from renja_subkegiatan GROUP BY idprogram,kode_bidang_urusan,kode_program,nm_program


SELECT y.* FROM
(SELECT x.*,k.kode_sub_kegiatan FROM
(SELECT a.id_sub_skpd,a.kode_sub_giat,a.rincian FROM sipd.sipdri_subkegiatan a WHERE a.id_jadwal=3200)x
LEFT JOIN ta_renja_subkegiatan k ON ( x.id_sub_skpd = k.id_sub_pd) AND (x.kode_sub_giat = k.kode_sub_kegiatan)
) y WHERE y.rincian >


UPDATE ta_renja_subkegiatan AS t1
SET anggaran = t2.rincian
FROM (SELECT a.id_sub_skpd,a.kode_sub_giat,a.rincian FROM sipd.sipdri_subkegiatan a WHERE a.id_jadwal=3200) AS t2
WHERE ( t2.id_sub_skpd = t1.id_sub_pd) AND (t2.kode_sub_giat = t1.kode_sub_kegiatan);


SELECT y.* FROM
(SELECT x.*,k.kode_sub_kegiatan FROM
(SELECT a.id_sub_skpd,a.kode_sub_giat,a.rincian FROM sipd.sipdri_subkegiatan a WHERE a.id_jadwal=3200)x
LEFT JOIN ta_renja_subkegiatan k ON ( x.id_sub_skpd = k.id_sub_pd) AND (x.kode_sub_giat = k.kode_sub_kegiatan)
) y WHERE y.kode_sub_kegiatan is NULL AND y.rincian > 0


UPDATE renja_sasaran AS t1
SET id_pd = t2.id_pd
FROM ta_opd AS t2
WHERE ( t2.kode = t1.kodeskpd)



INSERT INTO public.ta_renja_subkegiatan (
  tahun,
  idprogram,
  idkegiatan,
  idsubkegiatan,
  id_sub_pd,id_sub_kegiatan,
  kode_bidang_urusan,
  kode_program,
  kode_kegiatan,
  kode_sub_kegiatan,
  nm_program,
  nm_kegiatan,
  nm_sub_kegiatan,
  anggaran
)
SELECT 2025,t.idprogram,t.idkegiatan,uuid_generate_v7() as idsubkegiatan,
v.id_sub_skpd,v.id_sub_giat,v.kode_bidang_urusan,v.kode_program,v.kode_giat,v.kode_sub_giat,v.nama_program,
v.nama_giat,v.nama_sub_giat,v.rincian
 FROM
(
SELECT 
x.id_sub_skpd,
x.id_sub_giat,
x.kode_bidang_urusan,x.kode_program,x.kode_giat,x.kode_sub_giat,
x.nama_program,x.nama_giat,x.nama_sub_giat,x.rincian,
k.kode_sub_kegiatan FROM
(SELECT a.* FROM sipd.sipdri_subkegiatan a WHERE a.tahun=2025 AND a.id_jadwal=3200)x
LEFT JOIN ta_renja_subkegiatan k ON ( x.id_sub_skpd = k.id_sub_pd) 
AND (x.kode_sub_giat = k.kode_sub_kegiatan)
WHERE k.kode_sub_kegiatan IS NULL AND x.rincian > 0
)v JOIN (SELECT DISTINCT idprogram,idkegiatan,id_sub_pd, kode_program,kode_kegiatan FROM ta_renja_subkegiatan ) t
ON (v.id_sub_skpd = t.id_sub_pd) AND
(v.kode_program = t.kode_program)
AND (v.kode_giat=t.kode_kegiatan)



INSERT INTO public.ta_renja_subkegiatan (
  tahun,
  idprogram,
  idkegiatan,
  idsubkegiatan,
  id_sub_pd,id_sub_kegiatan,
  kode_bidang_urusan,
  kode_program,
  kode_kegiatan,
  kode_sub_kegiatan,
  nm_program,
  nm_kegiatan,
  nm_sub_kegiatan,
  anggaran
)
SELECT 2025,t.idprogram,uuid_generate_v7() as idkegiatan,uuid_generate_v7() as idsubkegiatan,
v.id_sub_skpd,v.id_sub_giat,v.kode_bidang_urusan,v.kode_program,v.kode_giat,v.kode_sub_giat,v.nama_program,
v.nama_giat,v.nama_sub_giat,v.rincian
 FROM
(
SELECT 
x.id_sub_skpd,
x.id_sub_giat,
x.kode_bidang_urusan,x.kode_program,x.kode_giat,x.kode_sub_giat,
x.nama_program,x.nama_giat,x.nama_sub_giat,x.rincian,
k.kode_sub_kegiatan FROM
(SELECT a.* FROM sipd.sipdri_subkegiatan a WHERE a.tahun=2025 AND a.id_jadwal=3200)x
LEFT JOIN ta_renja_subkegiatan k ON ( x.id_sub_skpd = k.id_sub_pd) 
AND (x.kode_sub_giat = k.kode_sub_kegiatan)
WHERE k.kode_sub_kegiatan IS NULL AND x.rincian > 0
)v JOIN (SELECT DISTINCT idprogram,id_sub_pd, kode_program FROM ta_renja_subkegiatan ) t
ON (v.id_sub_skpd = t.id_sub_pd) AND
(v.kode_program = t.kode_program)




SELECT 
n.id_sub_skpd,
sk.idprogram,
sk.idkegiatan,
sk.idsubkegiatan,
  n.kode_sub_skpd,
  n.nama_sub_skpd,
  n.kode_program,
  n.nama_program,
  n.kode_giat,
  n.nama_giat,
  n.kode_sub_giat,
  n.nama_sub_giat,
  sk.anggaran as sebelum,
  n.rincian as setelah,  
  (n.rincian - sk.anggaran) as selisih
FROM
  sipdlocal.sipdri_subkegiatan_new n
  LEFT  JOIN public.ta_renja_subkegiatan sk ON (n.id_sub_skpd = sk.id_sub_pd)
  AND (n.kode_program = sk.kode_program)
  AND (n.kode_giat = sk.kode_kegiatan)
  AND (n.kode_sub_giat = sk.kode_sub_kegiatan)
  WHERE (COALESCE(n.rincian,0) - COALESCE(sk.anggaran, 0)) != 0
  ORDER BY n.kode_sub_skpd, n.kode_program, n.kode_giat, n.kode_sub_giat
 






 update ta_renja_subkegiatan set anggaran = 170189569709 where idsubkegiatan='019b9875-5e5c-7485-a184-0d918b34e637';
update ta_renja_subkegiatan set anggaran = 1090644900 where idsubkegiatan='019b9875-5e5c-7c71-903d-ed15af0ae9b5';
update ta_renja_subkegiatan set anggaran = 1485772000 where idsubkegiatan='019b9875-5e60-753b-8c47-77df36153d39';
update ta_renja_subkegiatan set anggaran = 170952000 where idsubkegiatan='019b9875-5e60-7096-82eb-8eb0408429ea';
update ta_renja_subkegiatan set anggaran = 162107800 where idsubkegiatan='019b9875-5e60-77ba-b7b4-7b27c497f398';
update ta_renja_subkegiatan set anggaran = 327038000 where idsubkegiatan='019b9875-5e61-7e34-b1c6-03f03d6ad6e7';
update ta_renja_subkegiatan set anggaran = 190096000 where idsubkegiatan='019b9875-5e61-7619-8e2a-d1ef4aeadea9';
update ta_renja_subkegiatan set anggaran = 124000000 where idsubkegiatan='019b9875-5e61-7179-9182-1567a25ab2ad';
update ta_renja_subkegiatan set anggaran = 178206000 where idsubkegiatan='019b9875-5e62-7a0b-8317-089cec01da0a';
update ta_renja_subkegiatan set anggaran = 187079000 where idsubkegiatan='019b9875-5e62-79f9-9b9e-3f79bd9d0341';
update ta_renja_subkegiatan set anggaran = 192599000 where idsubkegiatan='019b9875-5e62-7f43-8237-6577e878ef38';
update ta_renja_subkegiatan set anggaran = 176244000 where idsubkegiatan='019b9875-5e63-7d4d-bd8e-a56534ec2bec';
update ta_renja_subkegiatan set anggaran = 218837000 where idsubkegiatan='019b9875-5e63-7d7d-9209-d114b1bcd37c';
update ta_renja_subkegiatan set anggaran = 16575000 where idsubkegiatan='019b9875-5e63-75c1-9093-c27fb9ee27c9';
update ta_renja_subkegiatan set anggaran = 205967000 where idsubkegiatan='019b9875-5e63-7f67-a16d-9a04e1c1795c';
update ta_renja_subkegiatan set anggaran = 169218000 where idsubkegiatan='019b9875-5e64-7d8a-b784-e9a55d965f74';
update ta_renja_subkegiatan set anggaran = 129745000 where idsubkegiatan='019b9875-5e64-7b18-b37a-5fc6c8d150d5';
update ta_renja_subkegiatan set anggaran = 136271000 where idsubkegiatan='019b9875-5e64-772c-b736-d4da931d0ff1';
update ta_renja_subkegiatan set anggaran = 4892000000 where idsubkegiatan='019b9875-5e64-79e8-acd1-7127eee88443';
update ta_renja_subkegiatan set anggaran = 7947044648 where idsubkegiatan='019b9875-5e65-7ad6-8407-6ae9e1314795';
update ta_renja_subkegiatan set anggaran = 974740500 where idsubkegiatan='019b9875-5e64-7b04-82f3-61af17ac772d';
update ta_renja_subkegiatan set anggaran = 801988500 where idsubkegiatan='019b9875-5e64-79bc-a2b8-482371258555';
update ta_renja_subkegiatan set anggaran = 3097875653 where idsubkegiatan='019b9875-5e64-78a7-a056-152a3b1a3bd8';
update ta_renja_subkegiatan set anggaran = 285082808 where idsubkegiatan='019b9875-5e65-7c55-bfc4-7015b6c5309a';
update ta_renja_subkegiatan set anggaran = 24000000 where idsubkegiatan='019b9875-5e6c-7812-9991-9d12f08a6dc1';
update ta_renja_subkegiatan set anggaran = 33600000 where idsubkegiatan='019b9875-5e6c-7ece-a863-d79a5a9d7a46';
update ta_renja_subkegiatan set anggaran = 1155040800 where idsubkegiatan='019b9875-5e6d-7709-9724-e0741ff0948d';
update ta_renja_subkegiatan set anggaran = 5835580900 where idsubkegiatan='019b9875-5e6d-79a7-a6ce-0094c7b6c0aa';
update ta_renja_subkegiatan set anggaran = 2849100000 where idsubkegiatan='019b9875-5e7a-7aa5-806a-61f4ffb0e8aa';
