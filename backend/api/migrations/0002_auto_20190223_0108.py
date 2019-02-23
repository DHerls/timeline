# Generated by Django 2.1.7 on 2019-02-23 01:08

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Event',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('time_start', models.DateTimeField()),
                ('time_end', models.DateTimeField()),
            ],
        ),
        migrations.CreateModel(
            name='EventType',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='SharedEvent',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('relationship', models.CharField(choices=[('O', 'Original'), ('S', 'Shared'), ('R', 'Restricted')], max_length=1)),
                ('color_primary', models.CharField(default='ffffff', max_length=6)),
                ('color_secondary', models.CharField(default='000000', max_length=6)),
                ('event', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.Event')),
                ('event_type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.EventType')),
                ('timeline', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.Timeline')),
            ],
        ),
        migrations.CreateModel(
            name='SharedEventType',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('relationship', models.CharField(choices=[('O', 'Original'), ('S', 'Shared'), ('R', 'Restricted')], max_length=1)),
                ('color_primary', models.CharField(default='ffffff', max_length=6)),
                ('color_secondary', models.CharField(default='000000', max_length=6)),
                ('event_type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.EventType')),
                ('timeline', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.Timeline')),
            ],
        ),
        migrations.AddField(
            model_name='timeline',
            name='event_types',
            field=models.ManyToManyField(blank=True, through='api.SharedEventType', to='api.EventType'),
        ),
        migrations.AddField(
            model_name='timeline',
            name='events',
            field=models.ManyToManyField(blank=True, through='api.SharedEvent', to='api.Event'),
        ),
    ]
