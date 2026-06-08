update sipd.sipdri_subkegiatan set idsubkegiatan = uuid_generate_v7();

INSERT INTO sipd.sipdri_kegiatan 
SELECT uuid_generate_v7() as idkegiatan, x.* FROM
(SELECT   DISTINCT  s.tahun, s.id_sub_skpd,s.kode_program, s.id_giat, s.kode_giat, s.nama_giat  from sipd.sipdri_subkegiatan s) x;

INSERT INTO sipd.sipdri_program
SELECT uuid_generate_v7() as idprogram, x.* FROM
(SELECT   DISTINCT  s.tahun, s.id_sub_skpd,s.kode_program, s.id_program,  s.nama_program  from sipd.sipdri_subkegiatan s) x;


UPDATE sipd.sipdri_subkegiatan  s
SET idprogram = p.idprogram
FROM sipd.sipdri_program p
WHERE s.id_sub_skpd = p.id_sub_skpd AND s.kode_program = p.kode_program AND s.id_program = p.id_program;


UPDATE sipd.sipdri_subkegiatan  s
SET idkegiatan = p.idkegiatan
FROM sipd.sipdri_kegiatan p
WHERE s.id_sub_skpd = p.id_sub_skpd AND s.kode_program = p.kode_program AND s.id_giat = p.id_giat AND s.kode_giat = p.kode_giat;

UPDATE sipd.sipdri_subkegiatan_output  s
SET idsubkegiatan = p.idsubkegiatan
FROM sipd.sipdri_subkegiatan p
WHERE s.id_sub_bl = p.id_sub_bl;


TRUNCATE TABLE renja_subkegiatan CASCADE;
TRUNCATE TABLE renja_subkegiatan_realisasi;
TRUNCATE TABLE renja_indikator CASCADE;
TRUNCATE TABLE renja_indikator_realisasi;



INSERT INTO renja_subkegiatan
(idsubkegiatan,
idkegiatan,
idprogram,
id_sub_kegiatan,
tahun,
id_sub_pd,
kode_bidang_urusan,
kode_program,
kode_kegiatan,
kode_sub_kegiatan,
nm_program,
nm_kegiatan,
nm_sub_kegiatan,
anggaran,
anggaran_murni,
anggaran_geser,
anggaran_perubahan)
SELECT 
idsubkegiatan,
idkegiatan,
idprogram,
id_sub_bl,
tahun,
id_sub_skpd,
kode_bidang_urusan,
kode_program,
kode_giat,
kode_sub_giat,
nama_program,
nama_giat,
nama_sub_giat,
rincian as anggaran,
rincian as anggaran_murni,
rincian as anggaran_geser,
rincian as anggaran_perubahan FROM sipd.sipdri_subkegiatan;

INSERT INTO renja_indikator
(
lvl,
id_parent,
tahun,
id_sub_pd,
kode,
nomor,
tolok_ukur,
satuan,
idformula,
idjenis,
iskota,
target_renja,
target_renja_murni,
target,
target_murni,
target_pk,
target_pk_murni
)
SELECT 
7,
idsubkegiatan,
tahun,
id_sub_skpd,
1,
1,
tolak_ukur,
satuan,
1,
1,
0,
target,
target,
target,
target,
target,
target  FROM sipd.sipdri_subkegiatan_output




INSERT INTO ta_renja_subkegiatan SELECT * FROM renja_subkegiatan;

update renja_indikator set id_sub_pd= 890 where id_sub_pd=9160;
update renja_indikator set id_sub_pd= 891 where id_sub_pd=9161;
update renja_indikator set id_sub_pd= 892 where id_sub_pd=9162;
update renja_indikator set id_sub_pd= 894 where id_sub_pd=9163;
update renja_indikator set id_sub_pd= 895 where id_sub_pd=9164;
update renja_indikator set id_sub_pd= 896 where id_sub_pd=9165;
update renja_indikator set id_sub_pd= 897 where id_sub_pd=9166;
update renja_indikator set id_sub_pd= 898 where id_sub_pd=9167;
update renja_indikator set id_sub_pd= 899 where id_sub_pd=9168;
update renja_indikator set id_sub_pd= 900 where id_sub_pd=9169;
update renja_indikator set id_sub_pd= 901 where id_sub_pd=9170;
update renja_indikator set id_sub_pd= 902 where id_sub_pd=9171;
update renja_indikator set id_sub_pd= 903 where id_sub_pd=9172;
update renja_indikator set id_sub_pd= 904 where id_sub_pd=9173;
update renja_indikator set id_sub_pd= 905 where id_sub_pd=9174;
update renja_indikator set id_sub_pd= 906 where id_sub_pd=9175;
update renja_indikator set id_sub_pd= 907 where id_sub_pd=9176;
update renja_indikator set id_sub_pd= 908 where id_sub_pd=9177;
update renja_indikator set id_sub_pd= 17713 where id_sub_pd=17714;

update renja_indikator set id_sub_pd= 557 where id_sub_pd=9178;
update renja_indikator set id_sub_pd= 558 where id_sub_pd=9179;
update renja_indikator set id_sub_pd= 559 where id_sub_pd=9180;
update renja_indikator set id_sub_pd= 560 where id_sub_pd=9181;
update renja_indikator set id_sub_pd= 561 where id_sub_pd=9182;
update renja_indikator set id_sub_pd= 562 where id_sub_pd=9183;
update renja_indikator set id_sub_pd= 563 where id_sub_pd=9184;
update renja_indikator set id_sub_pd= 564 where id_sub_pd=9185;
update renja_indikator set id_sub_pd= 565 where id_sub_pd=9186;
update renja_indikator set id_sub_pd= 534 where id_sub_pd=9188;


