from django.db import models


# Create your models here.

class Tag(models.Model):
    """
        Model representing a Tag
    """

    class Meta:
        verbose_name = 'Tag'
        verbose_name_plural = 'Tags'

    name = models.CharField(max_length=255, )

    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Created At',
                                      help_text='Date and time when the tag was created')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Updated At',
                                      help_text='Date and time when the tag was last updated')

    def __str__(self):
        return self.name


class Attachment(models.Model):
    """
        Model representing an Attachment
    """
    file_url = models.FileField(upload_to='attachments/%Y/%m/%d/', verbose_name='File URL',
                                help_text='URL of the file', blank=True, null=True)
    file_type = models.CharField(max_length=255, verbose_name='File Type',
                                 help_text='Type of the file', blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True, verbose_name='Uploaded At',
                                       help_text='Date and time when the file was uploaded')

    def __str__(self):
        return self.file_url.name
