# Generated by Django 2.2.1 on 2019-05-30 07:39

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='State',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('state_name', models.CharField(max_length=40)),
                ('sio_name', models.CharField(max_length=55)),
                ('email', models.CharField(max_length=70)),
            ],
        ),
        migrations.CreateModel(
            name='Officer',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('position', models.CharField(choices=[('Scientist-A', 'Scientist-A'), ('Scientist-B', 'Scientist-B'), ('Scientist-C', 'Scientist-C'), ('Scientist-D', 'Scientist-D'), ('Scientist-E', 'Scientist-E'), ('Scientist-F', 'Scientist-F')], max_length=100)),
                ('email', models.CharField(max_length=100)),
                ('state', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='quality_leads.State')),
            ],
        ),
    ]